<?php

namespace App\Enum;

use ReflectionException;

abstract class EnumStatusLoan extends Enum
{

    const BORROWED = 'borrowed';
    const RETURNED = 'returned';

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
