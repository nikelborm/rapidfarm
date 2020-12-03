Что ферма может прислать на сервер?

{"messageType": "event", "process": "oxidation",     "state": "started" }
{"messageType": "event", "process": "oxidation",     "state": "finished"}
{"messageType": "event", "process": "watering",      "state": "started" }
{"messageType": "event", "process": "watering",      "state": "finished"}
{"messageType": "event", "process": "lighting",      "state": "started" }
{"messageType": "event", "process": "lighting",      "state": "finished"}
{"messageType": "event", "process": "groundHeating", "state": "started" }
{"messageType": "event", "process": "groundHeating", "state": "finished"}
{"messageType": "event", "process": "waterHeating",  "state": "started" }
{"messageType": "event", "process": "waterHeating",  "state": "finished"}
{"messageType": "event", "process": "airHeating",    "state": "started" }
{"messageType": "event", "process": "airHeating",    "state": "finished"}
{"messageType": "criticalEvent", "problemWith": "groundTemperature",    "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterTemperature",     "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "airTemperature",       "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundHumidity",       "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "airHumidity",          "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundOxidationState", "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterOxidationState",  "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundSaltState",      "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterSaltState",       "valueNow": Число, "criticalValue": Число }
{"messageType": "sensorLogs", "sensor": "groundTemperature",    "value": Число }
{"messageType": "sensorLogs", "sensor": "waterTemperature",     "value": Число }
{"messageType": "sensorLogs", "sensor": "airTemperature",       "value": Число }
{"messageType": "sensorLogs", "sensor": "groundHumidity",       "value": Число }
{"messageType": "sensorLogs", "sensor": "airHumidity",          "value": Число }
{"messageType": "sensorLogs", "sensor": "groundOxidationState", "value": Число }
{"messageType": "sensorLogs", "sensor": "waterOxidationState",  "value": Число }
{"messageType": "sensorLogs", "sensor": "groundSaltState",      "value": Число }
{"messageType": "sensorLogs", "sensor": "waterSaltState",       "value": Число }
{"messageType": "stateSyncPackage", "state": {
    "oxidation":    "started",
    "watering":     "started",
    "lighting":     "started",
    "groundHeating":"started",
    "waterHeating": "started",
    "airHeating":   "started",
}
{"messageType": "stateSyncPackage", "state": {
    "oxidation":    "finished",
    "watering":     "finished",
    "lighting":     "finished",
    "groundHeating":"finished",
    "waterHeating": "finished",
    "airHeating":   "finished",
}

Что пользователь может прислать на сервер?

{"command": "set", "what": "ProcessTimings",      "process": "oxidation",     timings: []} // TODO: Подумать как реализовать временной конфиг процесса
{"command": "set", "what": "ProcessTimings",      "process": "watering",      timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "lighting",      timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "groundHeating", timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "waterHeating",  timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "airHeating",    timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "oxidation",     timings: []} // в интерфейсе показывать временную линию текущего времени
{"command": "set", "what": "TodayProcessTimings", "process": "watering",      timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "lighting",      timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "groundHeating", timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "waterHeating",  timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "airHeating",    timings: []}
{"command": "set", "what": "config"  }
{"command": "get", "what": "stateSyncPackage"  }
{"command": "stopAllSystemsInFarm" }
{"command": "workWithThisFarm", name: "asdasdasd" }

Что сервер может прислать на ферму?

{"command": "set", "what": "ProcessTimings",      "process": "oxidation",     timings: []} // TODO: Подумать как реализовать временной конфиг процесса
{"command": "set", "what": "ProcessTimings",      "process": "watering",      timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "lighting",      timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "groundHeating", timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "waterHeating",  timings: []}
{"command": "set", "what": "ProcessTimings",      "process": "airHeating",    timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "oxidation",     timings: []} // в интерфейсе показывать временную линию текущего времени
{"command": "set", "what": "TodayProcessTimings", "process": "watering",      timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "lighting",      timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "groundHeating", timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "waterHeating",  timings: []}
{"command": "set", "what": "TodayProcessTimings", "process": "airHeating",    timings: []}

{"command": "shutDownFarm" }
{"command": "getStateSyncPackage" }


Что сервер может прислать пользователю?

{"messageType": "event", "process": "oxidation",     "state": "started" }
{"messageType": "event", "process": "oxidation",     "state": "finished"}
{"messageType": "event", "process": "watering",      "state": "started" }
{"messageType": "event", "process": "watering",      "state": "finished"}
{"messageType": "event", "process": "lighting",      "state": "started" }
{"messageType": "event", "process": "lighting",      "state": "finished"}
{"messageType": "event", "process": "groundHeating", "state": "started" }
{"messageType": "event", "process": "groundHeating", "state": "finished"}
{"messageType": "event", "process": "waterHeating",  "state": "started" }
{"messageType": "event", "process": "waterHeating",  "state": "finished"}
{"messageType": "event", "process": "airHeating",    "state": "started" }
{"messageType": "event", "process": "airHeating",    "state": "finished"}
{"messageType": "criticalEvent", "problemWith": "groundTemperature",    "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterTemperature",     "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "airTemperature",       "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundHumidity",       "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "airHumidity",          "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundOxidationState", "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterOxidationState",  "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "groundSaltState",      "valueNow": Число, "criticalValue": Число }
{"messageType": "criticalEvent", "problemWith": "waterSaltState",       "valueNow": Число, "criticalValue": Число }
{"messageType": "sensorLogs", "sensor": "groundTemperature",    "value": Число }
{"messageType": "sensorLogs", "sensor": "waterTemperature",     "value": Число }
{"messageType": "sensorLogs", "sensor": "airTemperature",       "value": Число }
{"messageType": "sensorLogs", "sensor": "groundHumidity",       "value": Число }
{"messageType": "sensorLogs", "sensor": "airHumidity",          "value": Число }
{"messageType": "sensorLogs", "sensor": "groundOxidationState", "value": Число }
{"messageType": "sensorLogs", "sensor": "waterOxidationState",  "value": Число }
{"messageType": "sensorLogs", "sensor": "groundSaltState",      "value": Число }
{"messageType": "sensorLogs", "sensor": "waterSaltState",       "value": Число }
{"messageType": "stateSyncPackage", "state": {
    "oxidation":    "started",
    "watering":     "started",
    "lighting":     "started",
    "groundHeating":"started",
    "waterHeating": "started",
    "airHeating":   "started",
}
{"messageType": "stateSyncPackage", "state": {
    "oxidation":    "finished",
    "watering":     "finished",
    "lighting":     "finished",
    "groundHeating":"finished",
    "waterHeating": "finished",
    "airHeating":   "finished",
}
