from rest_framework import serializers
from .models import Book, BookCopy, Member, MemberBookCheckout

class BookCopySerializer(serializers.ModelSerializer):
    """Handles Physical Inventory; includes nested Book title for convenience"""
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = BookCopy
        fields = ['id', 'book', 'book_title', 'book_uid', 'is_available', 'added_at']
        
class BookSerializer(serializers.ModelSerializer):
    """Handles Metadata for Books"""
    # New field to specify quantity during creation
    copies = BookCopySerializer(many=True, read_only=True)
    number_of_copies = serializers.IntegerField(write_only=True, default=1, min_value=1)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'copies', 'number_of_copies']


class MemberSerializer(serializers.ModelSerializer):
    """Handles Patron data including the manual loaned count"""
    class Meta:
        model = Member
        fields = [
            'id', 'name', 'member_id', 'email', 'phone', 
            'is_active', 'membership_start', 'current_books_loaned_count'
        ]

class MemberBookCheckoutSerializer(serializers.ModelSerializer):
    """Handles Transactions; includes readable UIDs for the Frontend"""
    book_uid = serializers.ReadOnlyField(source='copy.book_uid')
    member_id_str = serializers.ReadOnlyField(source='member.member_id')
    book_title = serializers.ReadOnlyField(source='copy.book.title')

    class Meta:
        model = MemberBookCheckout
        fields = [
            'id', 'copy', 'book_uid', 'book_title', 'member', 
            'member_id_str', 'checkout_date', 'return_date', 
            'is_returned', 'processed_by'
        ]