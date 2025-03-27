<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Request;

class Book extends Model
{
    use HasFactory;
    /**
     * @var string
     */
    protected $table = 'books';

    /**
     * @var string[]
     */
    protected $fillable = ['title', 'author', 'quantity'];

    /**
     * @return string[]
     */
    protected function casts(): array
    {
        return [

        ];
    }

    /**
     * @param $query
     * @return $query
     */
    public function scopeFilterSearch($query)
    {
        $filter = Request::all();

        if (!empty($filter['search'])) {
            $query->where("title", "LIKE", "%{$filter["search"]}%")
                ->orWhere("author", "LIKE", "%{$filter["search"]}%");
        }

        if (!empty($filter['title'])) {
            $query->where("title", "LIKE", "%{$filter["title"]}%");
        }

        if (!empty($filter['author'])) {
            $query->where("author", "LIKE", "%{$filter["author"]}%");
        }

        if (!empty($filter['quantity'])) {
            $query->where("quantity", $filter["quantity"]);
        }

        return $query;
    }

    /**
     * @return HasMany
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * @return HasMany
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
