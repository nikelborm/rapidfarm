Что ферма может прислать на сервер?

{ "class": "event", "process": "watering",      "isActive": true  }
{ "class": "event", "process": "lighting",      "isActive": true  }
{ "class": "event", "process": "oxidation",     "isActive": true  }
{ "class": "event", "process": "groundHeating", "isActive": true  }
{ "class": "event", "process": "waterHeating",  "isActive": true  }
{ "class": "event", "process": "airHeating",    "isActive": true  }
{ "class": "event", "process": "oxidation",     "isActive": false }
{ "class": "event", "process": "watering",      "isActive": false }
{ "class": "event", "process": "lighting",      "isActive": false }
{ "class": "event", "process": "groundHeating", "isActive": false }
{ "class": "event", "process": "waterHeating",  "isActive": false }
{ "class": "event", "process": "airHeating",    "isActive": false }

{ "class": "records", "sensor": "groundTemperature", "value": Число }
{ "class": "records", "sensor": "waterTemperature",  "value": Число }
{ "class": "records", "sensor": "airTemperature",    "value": Число }
{ "class": "records", "sensor": "groundHumidity",    "value": Число }
{ "class": "records", "sensor": "airHumidity",       "value": Число }
{ "class": "records", "sensor": "groundOxidation",   "value": Число }
{ "class": "records", "sensor": "waterOxidation",    "value": Число }
{ "class": "records", "sensor": "groundSalt",        "value": Число }
{ "class": "records", "sensor": "waterSalt",         "value": Число }

{ "class": "warning", "sensor": "groundTemperature", "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterTemperature",  "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airTemperature",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundHumidity",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airHumidity",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundOxidation",   "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterOxidation",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundSalt",        "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterSalt",         "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "activitySyncPackage", "package": {
    "oxidation":     true,
    "watering":      true,
    "lighting":      true,
    "groundHeating": true,
    "waterHeating":  true,
    "airHeating":    true,
} }
{ "class": "activitySyncPackage", "package": {
    "oxidation":     false,
    "watering":      false,
    "lighting":      false,
    "groundHeating": false,
    "waterHeating":  false,
    "airHeating":    false,
} }
{ "class": "loginAsFarm", "secret": "64СимволаДлинныйКлюч", "name": "Имя фермы" }



Что пользователь может прислать на сервер?

{ "class": "set", "what": "timings",      "process": "oxidation",     "timings": [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "timings",      "process": "watering",      "timings": [] }
{ "class": "set", "what": "timings",      "process": "lighting",      "timings": [] }
{ "class": "set", "what": "timings",      "process": "groundHeating", "timings": [] }
{ "class": "set", "what": "timings",      "process": "waterHeating",  "timings": [] }
{ "class": "set", "what": "timings",      "process": "airHeating",    "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "oxidation",     "timings": [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "todayTimings", "process": "watering",      "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "lighting",      "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "groundHeating", "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "waterHeating",  "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "airHeating",    "timings": [] }

{ "class": "set", "what": "config" }
{ "class": "get", "what": "activitySyncPackage" }
{ "class": "execute", "what": "shutDownFarm" }
{ "class": "execute", "what": "workWithFarm", "name": "asdasdasd"  }
{ "class": "execute", "what": "addNewFarm", "name": "asdasdasd"  } ?????
{ "class": "loginAsUser", "email": "asd@mail.ru", "password": "asdasdasd"  }
{ "class": "registerAsUser", "password": "strong cat", "confirmPassword": "strong cat", "fullName": "asd", "email": "asd@mail.ru"  }

Что сервер может прислать на ферму?

{ "class": "set", "what": "timings",      "process": "oxidation",     "timings": [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "timings",      "process": "watering",      "timings": [] }
{ "class": "set", "what": "timings",      "process": "lighting",      "timings": [] }
{ "class": "set", "what": "timings",      "process": "groundHeating", "timings": [] }
{ "class": "set", "what": "timings",      "process": "waterHeating",  "timings": [] }
{ "class": "set", "what": "timings",      "process": "airHeating",    "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "oxidation",     "timings": [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "todayTimings", "process": "watering",      "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "lighting",      "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "groundHeating", "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "waterHeating",  "timings": [] }
{ "class": "set", "what": "todayTimings", "process": "airHeating",    "timings": [] }

{ "class": "get", "what": "activitySyncPackage" }
{ "class": "set", "what": "config" }
{ "class": "execute", "what": "shutDownFarm" }
{ "class": "execute", "what": "updateArduino" }
{ report: { isError: true, info: "У фермы нет имени" }, reply: {} }
{ report: { isError: true, info: "Ферма не зарегистрирована" }, reply: {} }
{ report: { isError: false, info: "Успешная авторизация" }, reply: {} }


Что сервер может прислать пользователю?

{ "class": "event", "process": "watering",      "isActive": true  }
{ "class": "event", "process": "lighting",      "isActive": true  }
{ "class": "event", "process": "oxidation",     "isActive": true  }
{ "class": "event", "process": "groundHeating", "isActive": true  }
{ "class": "event", "process": "waterHeating",  "isActive": true  }
{ "class": "event", "process": "airHeating",    "isActive": true  }
{ "class": "event", "process": "oxidation",     "isActive": false }
{ "class": "event", "process": "watering",      "isActive": false }
{ "class": "event", "process": "lighting",      "isActive": false }
{ "class": "event", "process": "groundHeating", "isActive": false }
{ "class": "event", "process": "waterHeating",  "isActive": false }
{ "class": "event", "process": "airHeating",    "isActive": false }

{ "class": "records", "sensor": "groundTemperature", "value": Число }
{ "class": "records", "sensor": "waterTemperature",  "value": Число }
{ "class": "records", "sensor": "airTemperature",    "value": Число }
{ "class": "records", "sensor": "groundHumidity",    "value": Число }
{ "class": "records", "sensor": "airHumidity",       "value": Число }
{ "class": "records", "sensor": "groundOxidation",   "value": Число }
{ "class": "records", "sensor": "waterOxidation",    "value": Число }
{ "class": "records", "sensor": "groundSalt",        "value": Число }
{ "class": "records", "sensor": "waterSalt",         "value": Число }

{ "class": "warning", "sensor": "groundTemperature", "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterTemperature",  "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airTemperature",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundHumidity",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airHumidity",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundOxidation",   "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterOxidation",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundSalt",        "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterSalt",         "value": Число, "lowerBorder": Число, "upperBorder": Число }

{ "class": "activitySyncPackage", "package": {
    "oxidation":     true,
    "watering":      true,
    "lighting":      true,
    "groundHeating": true,
    "waterHeating":  true,
    "airHeating":    true,
} }
{ "class": "activitySyncPackage", "package": {
    "oxidation":     false,
    "watering":      false,
    "lighting":      false,
    "groundHeating": false,
    "waterHeating":  false,
    "airHeating":    false,
} }

{ report: { isError: true, info: "Вы не ввели почту", errorField: "email" }, reply: {} }
{ report: { isError: true, info: "Эта почта занята. Если вы владелец, попробуйте обратиться к администратору.", errorField: "email" }, reply: {} }
{ report: { isError: true, info: "Вы не ввели пароль", errorField: "password" }, reply: {} }
{ report: { isError: true, info: "Длина пароля должна быть от 8 символов", errorField: "password" }, reply: {} }
{ report: { isError: true, info: "Длина пароля должна быть до 40 символов", errorField: "password" }, reply: {} }
{ report: { isError: true, info: "Пароли не совпадают", errorField: "confirmPassword" }, reply: {} }
{ report: { isError: true, info: "Вы не ввели ваше имя", errorField: "fullName" }, reply: {} }
{ report: { isError: true, info: "Пользователь с указанной почтой не найден", errorField: "email" }, reply: {} }
{ report: { isError: true, info: "Неверный пароль", errorField: "password" }, reply: {} }
{ report: { isError: true, info: "Ошибка сервера" }, reply: {} }
{ report: { isError: true, info: "Регистрация запрещена" }, reply: {} }
{ report: { isError: false, info: "Успешная авторизация" }, reply: { fullName: "Полное имя" } }
{ report: { isError: false, info: "Регистрация успешна" }, reply: { fullName: "Полное имя" } }
