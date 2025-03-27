<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Request;

class Reservation extends Model
{
    /**
     * @var string
     */
    protected $table = 'reservations';

    /**
     * @var string[]
     */
    protected $fillable = ['user_id', 'book_id', 'reservation_date', 'status'];

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

        if (!empty($filter['user_id'])) {
            $query->where("user_id", $filter["user_id"]);
        }

        if (!empty($filter['book_id'])) {
            $query->where("book_id", $filter["book_id"]);
        }

        if (!empty($filter['reservation_date_start'])) {
            $query->where("reservation_date_start", ">=", $filter["reservation_date_start"]);
        }

        if (!empty($filter['reservation_date_end'])) {
            $query->where("reservation_date_end", "<=", $filter["reservation_date_end"]);
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
