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

Что пользователь может прислать на сервер?

{ "class": "set", "what": "processTimings",      "process": "oxidation",     timings: [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "processTimings",      "process": "watering",      timings: [] }
{ "class": "set", "what": "processTimings",      "process": "lighting",      timings: [] }
{ "class": "set", "what": "processTimings",      "process": "groundHeating", timings: [] }
{ "class": "set", "what": "processTimings",      "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "processTimings",      "process": "airHeating",    timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "oxidation",     timings: [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "todayProcessTimings", "process": "watering",      timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "lighting",      timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "groundHeating", timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "airHeating",    timings: [] }

{ "class": "set", "what": "config" }
{ "class": "get", "what": "activitySyncPackage" }
{ "class": "execute", "what": "shutDownFarm" }
{ "class": "execute", "what": "workWithFarm", "name": "asdasdasd"  }
{ "class": "execute", "what": "addNewFarm", "name": "asdasdasd"  } ?????

Что сервер может прислать на ферму?

{ "class": "set", "what": "processTimings",      "process": "oxidation",     timings: [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "processTimings",      "process": "watering",      timings: [] }
{ "class": "set", "what": "processTimings",      "process": "lighting",      timings: [] }
{ "class": "set", "what": "processTimings",      "process": "groundHeating", timings: [] }
{ "class": "set", "what": "processTimings",      "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "processTimings",      "process": "airHeating",    timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "oxidation",     timings: [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "todayProcessTimings", "process": "watering",      timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "lighting",      timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "groundHeating", timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "todayProcessTimings", "process": "airHeating",    timings: [] }

{ "class": "get", "what": "activitySyncPackage" }
{ "class": "set", "what": "config" }
{ "class": "execute", "what": "shutDownFarm" }


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
