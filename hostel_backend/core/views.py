from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Complaint, Room
import google.generativeai as genai
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

# 🔐 Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


# 🧠 Priority Logic (Rule + AI)
def classify_priority(text):
    text = text.lower()

    # 🔴 HIGH
    if any(word in text for word in [
        "water", "leakage",
        "toilet","blocked",
        "power", "power issue",
        "broken", "door lock",
        "flush",
        "window"
    ]):
        return "High"

    # 🟠 MEDIUM
    elif any(word in text for word in [
        "fan", "fan issue",
        "light not working", "light",
        "wifi not working", "wifi",
        "ac", "heater",
        "tap", "pressure"
    ]):
        return "Medium"

    # 🟢 LOW
    elif any(word in text for word in [
        "paint", "dirty", "not cleaned",
        "noise", "smell",
        "furniture", "curtain",
        "dust"
    ]):
        return "Low"

    # 🔹 AI fallback
    return ai_classify(text)


# 🔐 LOGIN
from django.contrib.auth import authenticate


@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            "user_id": user.id,
            "role": user.role
        })
    else:
        return Response({
            "error": "Invalid username or password"
        })

# 📝 ADD COMPLAINT
@api_view(['POST'])
def add_complaint(request):
    try:
        user_id = request.data.get('user_id')
        text = request.data.get('text')
        image = request.FILES.get('image')  # 👈 IMPORTANT

        if not user_id:
            return Response({"error": "User ID missing"})

        user = User.objects.get(id=int(user_id))

        priority = classify_priority(text)

        Complaint.objects.create(
            user=user,
            text=text,
            category="General",
            priority=priority,
            status="Pending",
            image=image   # 👈 SAVE IMAGE
        )

        return Response({"message": "Complaint added"})

    except Exception as e:
        return Response({"error": str(e)})



@api_view(['GET'])
def get_complaints(request):
    complaints = Complaint.objects.all()

    # 🔥 AUTO ESCALATION LOGIC
    for c in complaints:
        if c.status == "Pending":
            if timezone.now() - c.created_at > timedelta(hours=48):
                c.status = "Escalated"
                c.save()

    return Response(list(complaints.values()))

    return Response(data)



# 🔄 UPDATE STATUS
@api_view(['PATCH'])
def update_status(request, id):
    try:
        complaint = Complaint.objects.get(id=id)
        complaint.status = request.data.get("status")
        complaint.save()
        return Response({"message": "Updated"})
    except Exception as e:
        return Response({"error": str(e)})

@api_view(['GET'])
def get_rooms(request):
    rooms = Room.objects.all()

    data = []
    for r in rooms:
        occupied = r.occupants.count()
        capacity = r.capacity

        if occupied == capacity:
            status = "full"
        elif occupied == 0:
            status = "empty"
        else:
            status = "partial"

        data.append({
            "id": r.id,
            "number": r.number,
            "capacity": capacity,
            "occupied": occupied,
            "available": r.available_slots(),
            "status": status
        })

    return Response(data)


# 🤖 GEMINI AI
def ai_classify(text):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
        Classify this hostel complaint into one priority:
        High, Medium, or Low.

        Complaint: {text}

        Answer only one word: High, Medium, or Low.
        """

        response = model.generate_content(prompt)

        result = response.text.strip().capitalize()

        if result not in ["High", "Medium", "Low"]:
            return "Low"

        return result

    except Exception as e:
        print("AI Error:", e)
        return "Low"
    
@api_view(['POST'])
def book_room(request):
    user_id = request.data.get("user_id")
    room_id = request.data.get("room_id")

    try:
        user = User.objects.get(id=user_id)
        room = Room.objects.get(id=room_id)

        # ❌ full check
        if room.occupants.count() >= room.capacity:
            return Response({"error": "Room is full"})

        # ❌ already booked
        if room.occupants.filter(id=user.id).exists():
            return Response({"error": "Already booked"})

        room.occupants.add(user)

        return Response({"message": "Room booked successfully"})

    except Exception as e:
        return Response({"error": str(e)})