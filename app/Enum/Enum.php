<?php

namespace App\Enum;

use ReflectionException;

abstract class Enum
{
    /**
     * @param $class
     * @return array
     * @throws ReflectionException
     */
    public static function getConstants($class): array
    {
        $reflectionClass = new \ReflectionClass($class);
        return $reflectionClass->getConstants();
    }
}