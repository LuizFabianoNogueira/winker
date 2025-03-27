<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Request;

class Loan extends Model
{
    /**
     * @var string
     */
    protected $table = 'loans';

    /**
     * @var string[]
     */
    protected $fillable = ['user_id', 'book_id', 'loan_date', 'return_date', 'status'];

    /**
     * @return string[]
     */
    protected function casts(): array
    {
        return [

        ];
    }

    public function scopeFilterSearch($query)
    {
        $filter = Request::all();

        if (!empty($filter['search'])) {
            $query->where(function ($query) use ($filter) {
                $query->where('users.name', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('books.title', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('books.author', 'like', '%' . $filter['search'] . '%');
            });
        }

        if (!empty($filter['loan_date_start'])) {
            $query->where("loan_date", ">=", $filter["loan_date_start"]);
        }

        if (!empty($filter['loan_date_end'])) {
            $query->where("loan_date", "<=", $filter["loan_date_end"]);
        }

        if (!empty($filter['return_date_start'])) {
            $query->where("return_date", ">=", $filter["return_date_start"]);
        }

        if (!empty($filter['return_date_end'])) {
            $query->where("return_date", "<=", $filter["return_date_end"]);
        }

        if (!empty($filter['user_id'])) {
            $query->where("user_id", $filter["user_id"]);
        }

        if (!empty($filter['book_id'])) {
            $query->where("book_id", $filter["book_id"]);
        }

        if (!empty($filter['status'])) {
            if (is_array($filter['status'])) {
                 $query->whereIn("status", $filter["status"]);
            } else {
                $query->where("status", $filter["status"]);
            }
        }

        return $query;
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
