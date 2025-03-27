<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'uuid', Rule::exists('users', 'id')->ignore($this->id)],
            'book_id' => ['required', 'uuid', Rule::exists('books', 'id')->ignore($this->id)],
            'reservation_date' => ['required', 'date'],
            'status' => [Rule::enum(['pending', 'approved', 'rejected'])],
        ];
    }
}
