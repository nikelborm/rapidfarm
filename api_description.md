Что ферма может прислать на сервер?

{ "class": "event", "process": "watering",      isActive: true  }
{ "class": "event", "process": "lighting",      isActive: true  }
{ "class": "event", "process": "oxidation",     isActive: true  }
{ "class": "event", "process": "groundHeating", isActive: true  }
{ "class": "event", "process": "waterHeating",  isActive: true  }
{ "class": "event", "process": "airHeating",    isActive: true  }
{ "class": "event", "process": "oxidation",     isActive: false }
{ "class": "event", "process": "watering",      isActive: false }
{ "class": "event", "process": "lighting",      isActive: false }
{ "class": "event", "process": "groundHeating", isActive: false }
{ "class": "event", "process": "waterHeating",  isActive: false }
{ "class": "event", "process": "airHeating",    isActive: false }
{ "class": "records", "sensor": "groundTemperature",    "value": Число }
{ "class": "records", "sensor": "waterTemperature",     "value": Число }
{ "class": "records", "sensor": "airTemperature",       "value": Число }
{ "class": "records", "sensor": "groundHumidity",       "value": Число }
{ "class": "records", "sensor": "airHumidity",          "value": Число }
{ "class": "records", "sensor": "groundOxidationState", "value": Число }
{ "class": "records", "sensor": "waterOxidationState",  "value": Число }
{ "class": "records", "sensor": "groundSaltState",      "value": Число }
{ "class": "records", "sensor": "waterSaltState",       "value": Число }
{ "class": "warning", "sensor": "groundTemperature",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterTemperature",     "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airTemperature",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundHumidity",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airHumidity",          "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundOxidationState", "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterOxidationState",  "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundSaltState",      "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterSaltState",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "activitySyncPackage", "package": {
    "oxidation":     true,
    "watering":      true,
    "lighting":      true,
    "groundHeating": true,
    "waterHeating":  true,
    "airHeating":    true,
}
{ "class": "activitySyncPackage", "package": {
    "oxidation":     false,
    "watering":      false,
    "lighting":      false,
    "groundHeating": false,
    "waterHeating":  false,
    "airHeating":    false,
}

Что пользователь может прислать на сервер?

{ "class": "set", "what": "ProcessTimings",      "process": "oxidation",     timings: [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "ProcessTimings",      "process": "watering",      timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "lighting",      timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "groundHeating", timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "airHeating",    timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "oxidation",     timings: [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "TodayProcessTimings", "process": "watering",      timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "lighting",      timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "groundHeating", timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "airHeating",    timings: [] }

{ "class": "get", "what": "activitySyncPackage"  }
{ "class": "set", "what": "config"  }
{ "class": "execute", "what": "shutDownFarm"  }
{ "command": "workWithThisFarm", name: "asdasdasd" }

Что сервер может прислать на ферму?

{ "class": "set", "what": "ProcessTimings",      "process": "oxidation",     timings: [] } // TODO: Подумать как реализовать временной конфиг процесса
{ "class": "set", "what": "ProcessTimings",      "process": "watering",      timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "lighting",      timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "groundHeating", timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "ProcessTimings",      "process": "airHeating",    timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "oxidation",     timings: [] } // в интерфейсе показывать временную линию текущего времени
{ "class": "set", "what": "TodayProcessTimings", "process": "watering",      timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "lighting",      timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "groundHeating", timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "waterHeating",  timings: [] }
{ "class": "set", "what": "TodayProcessTimings", "process": "airHeating",    timings: [] }

{ "class": "get", "what": "activitySyncPackage"  }
{ "class": "set", "what": "config"  }
{ "class": "execute", "what": "shutDownFarm"  }


Что сервер может прислать пользователю?

{ "class": "event", "process": "watering",      isActive: true  }
{ "class": "event", "process": "lighting",      isActive: true  }
{ "class": "event", "process": "oxidation",     isActive: true  }
{ "class": "event", "process": "groundHeating", isActive: true  }
{ "class": "event", "process": "waterHeating",  isActive: true  }
{ "class": "event", "process": "airHeating",    isActive: true  }
{ "class": "event", "process": "oxidation",     isActive: false }
{ "class": "event", "process": "watering",      isActive: false }
{ "class": "event", "process": "lighting",      isActive: false }
{ "class": "event", "process": "groundHeating", isActive: false }
{ "class": "event", "process": "waterHeating",  isActive: false }
{ "class": "event", "process": "airHeating",    isActive: false }

{ "class": "records", "sensor": "groundTemperature",    "value": Число }
{ "class": "records", "sensor": "waterTemperature",     "value": Число }
{ "class": "records", "sensor": "airTemperature",       "value": Число }
{ "class": "records", "sensor": "groundHumidity",       "value": Число }
{ "class": "records", "sensor": "airHumidity",          "value": Число }
{ "class": "records", "sensor": "groundOxidationState", "value": Число }
{ "class": "records", "sensor": "waterOxidationState",  "value": Число }
{ "class": "records", "sensor": "groundSaltState",      "value": Число }
{ "class": "records", "sensor": "waterSaltState",       "value": Число }

{ "class": "warning", "sensor": "groundTemperature",    "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterTemperature",     "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airTemperature",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundHumidity",       "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "airHumidity",          "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundOxidationState", "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterOxidationState",  "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "groundSaltState",      "value": Число, "lowerBorder": Число, "upperBorder": Число }
{ "class": "warning", "sensor": "waterSaltState",       "value": Число, "lowerBorder": Число, "upperBorder": Число }

{ "class": "activitySyncPackage", "package": {
    "oxidation":     true,
    "watering":      true,
    "lighting":      true,
    "groundHeating": true,
    "waterHeating":  true,
    "airHeating":    true,
}
{ "class": "activitySyncPackage", "package": {
    "oxidation":     false,
    "watering":      false,
    "lighting":      false,
    "groundHeating": false,
    "waterHeating":  false,
    "airHeating":    false,
}
