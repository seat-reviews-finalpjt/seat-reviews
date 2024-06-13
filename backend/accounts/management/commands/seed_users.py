# accounts/management/commands/seed_users.py

from django.core.management.base import BaseCommand
from django_seed import Seed
from accounts.models import User

class Command(BaseCommand):
    help = 'Seed the database with User data'

    def add_arguments(self, parser):
        parser.add_argument('--number', type=int, help='Number of users to create', default=10)

    def handle(self, *args, **kwargs):
        number = kwargs['number']
        seeder = Seed.seeder()

        seeder.add_entity(User, number, {
            'username': lambda x: seeder.faker.user_name(),
            'email': lambda x: seeder.faker.email(),
            'first_name': lambda x: seeder.faker.first_name(),
            'last_name': lambda x: seeder.faker.last_name(),
        })

        inserted_pks = seeder.execute()
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {number} users'))
