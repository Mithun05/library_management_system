import uuid
from django.db import transaction
from django.utils import timezone
from .models import Book, BookCopy, Member, MemberBookCheckout

class LibraryService:
    
    @staticmethod
    def create_book_with_copies(book_data, num_copies):
        with transaction.atomic():
            # 1. Create the main Book metadata
            book = Book.objects.create(**book_data)

            # 2. Create the specified number of physical copies
            copies = []
            for _ in range(num_copies):
                # Generating a unique identifier (e.g., BK-uuid)
                unique_id = f"BK-{uuid.uuid4().hex[:8].upper()}"
                copies.append(BookCopy(
                    book=book,
                    book_uid=unique_id,
                    is_available=True
                ))
            
            # bulk_create is more efficient for multiple records
            BookCopy.objects.bulk_create(copies)
            
            return book
    
    @staticmethod
    def borrow_book(book_uid, member_id, staff_name):
        with transaction.atomic():
            copy = BookCopy.objects.select_for_update().get(book_uid=book_uid)
            member = Member.objects.select_for_update().get(member_id=member_id)

            if not copy.is_available or not member.is_active:
                raise ValueError("Book unavailable or Member inactive")

            # Update State
            copy.is_available = False
            copy.save()

            member.current_books_loaned_count += 1
            member.save()

            return MemberBookCheckout.objects.create(
                copy=copy, member=member, book_uid_stored=book_uid,
            member_id_stored=member_id, processed_by=staff_name
            )

    @staticmethod
    def return_book(book_uid):
        with transaction.atomic():
            loan = MemberBookCheckout.objects.select_for_update().get(
                copy__book_uid=book_uid, is_returned=False
            )
            
            loan.is_returned = True
            loan.return_date = timezone.now()
            loan.save()

            loan.copy.is_available = True
            loan.copy.save()

            if loan.member.current_books_loaned_count > 0:
                loan.member.current_books_loaned_count -= 1
                loan.member.save()
            return loan