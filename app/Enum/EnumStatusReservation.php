<?php

namespace App\Enum;

use ReflectionException;

abstract class EnumStatusReservation extends Enum
{
    const PENDING = 'pending';
    const APPROVED = 'approved';
    const CANCELLED = 'cancelled';

    /**
     * @return array
     * @throws ReflectionException
     */
    public static function getList(): array
    {
        $list = self::getConstants(__CLASS__);
        asort($list);
        return $list;
    }
}
