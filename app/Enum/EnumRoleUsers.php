<?php

namespace App\Enum;

use ReflectionException;

abstract class EnumRoleUsers extends Enum
{

    const ADMIN = 'admin';
    const USER = 'user';

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
