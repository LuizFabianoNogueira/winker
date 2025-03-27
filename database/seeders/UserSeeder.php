<?php

namespace Database\Seeders;

use App\Enum\EnumRoleUsers;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Book;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        #admin
        $u = User::where('email', 'admin@admin.com')->first();
        if(!$u) {
            $user = new User();
            $user->name = 'Admin';
            $user->email = 'admin@admin.com';
            $user->password = bcrypt('admin123');
            $user->role = EnumRoleUsers::ADMIN;
            $user->save();
        }
    }
}
