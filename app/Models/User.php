<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Request;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Filter the user's search.
     *
     * @param mixed $query
     * @return mixed
     */
    public function scopeFilterSearch($query)
    {
        $filter = Request::all();

        if (!empty($filter['search'])) {
            $query->where("name", "LIKE", "%{$filter["search"]}%")
                ->orWhere("email", "LIKE", "%{$filter["search"]}%");
        }

        if (!empty($filter['name'])) {
            $query->where("name", "LIKE", "%{$filter["name"]}%");
        }

        if (!empty($filter['email'])) {
            $query->where("email", "LIKE", "%{$filter["email"]}%");
        }

        if (!empty($filter['role'])) {
            $query->where("role", $filter["role"]);
        }

        return $query;
    }

    /**
     * Get the user's account.
     *
     * @return HasMany
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Get the user's reservations.
     *
     * @return HasMany
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
