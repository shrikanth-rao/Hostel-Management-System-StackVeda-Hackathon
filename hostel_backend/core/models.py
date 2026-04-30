from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    # extra fields (optional)
    course = models.CharField(max_length=50, blank=True)
    year = models.IntegerField(null=True, blank=True)
    sleep_schedule = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.username


# ROOM
class Room(models.Model):
    number = models.IntegerField()
    capacity = models.IntegerField()

    occupants = models.ManyToManyField(
        User,
        blank=True,
        related_name="rooms"
    )

    def available_slots(self):
        return self.capacity - self.occupants.count()

    def is_full(self):
        return self.occupants.count() >= self.capacity

    def __str__(self):
        return f"Room {self.number}"


# COMPLAINT
class Complaint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    status = models.CharField(default="Pending", max_length=20)
    image = models.ImageField(upload_to='complaints/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:30]
    
