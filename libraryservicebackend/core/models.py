from django.db import models

class Book(models.Model):
    """Represents the Book Metadata"""
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    published_date = models.DateField()

    def __str__(self):
        return f"{self.title} by {self.author}"

class BookCopy(models.Model):
    """Represents a physical book copy on the shelf"""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='copies')
    
    # Renamed from barcode to a generic Unique Identifier
    book_uid = models.CharField(
        max_length=100, 
        unique=True, 
        help_text="A unique tracking ID for this specific physical copy"
    )
    
    is_available = models.BooleanField(default=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book_uid} ({self.book.title})"        

class Member(models.Model):
    """The 'User' - Represents a library patron"""
    name = models.CharField(max_length=255)
    # Custom identifier (e.g., M-1001)
    member_id = models.CharField(max_length=50, unique=True) 
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    
    # Status: Active vs Inactive
    is_active = models.BooleanField(default=True)
    
    membership_start = models.DateField(auto_now_add=True)
    # NEW: Simple integer field to be updated manually via API logic
    current_books_loaned_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.member_id} - {self.name}"

class MemberBookCheckout(models.Model):
    copy = models.ForeignKey(BookCopy, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    # NEW: Explicit columns to store the string identifiers
    # We use null=True, blank=True if you want them to be optional at first
    book_uid_stored = models.CharField(max_length=100, null=True, blank=True)
    member_id_stored = models.CharField(max_length=50, null=True, blank=True)
    
    checkout_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)
    # NEW: Simple CharField for the staff member's name/ID
    processed_by = models.CharField(max_length=100, blank=True, null=True)              