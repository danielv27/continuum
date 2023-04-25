import { NodeMap, ReadWriteSpeed, ConfigurationMap, Connection, GCPConfig, defaultGCPConfig, BenchmarkConfig } from "./generics";
import { checkValidator } from "./validator";
import { nodesValidator, coresValidator, quotaValidator, readWriteSpeedValidator, memoryValidator, connectionValidator as connectionValidator, prefixIPValidator } from "./validate_generics"

class Configuration {
    provider: string; // Options: qemu, gcp, baremetal (mandatory)
    infra_only: boolean; // Default: false, Only do infrastructure deployment, ignore the benchmark
    nodes: NodeMap; // x >= 0, number of VMs to spawn per tier, ONLY IF X_nodes > 0, then the corresponding X_cores, X_memory, and X_quota are mandatory
    cores: NodeMap; // cloud >= 2 (edge and/or endpoint) >= 1 (each), number of cores per VM
    memory: NodeMap; // x >= 1, Memory in GB per VM
    quota: NodeMap; // 0.1 <= x <= 1.0, CPU bandwidth quota (at 0.5 a VM will use a CPU core for half of the time)
    readWriteSpeed: ReadWriteSpeed; // x >= 0, Default: 0 (unlimited) Read and write throughputs to disk in MB.
    wirelessNetworkPreset: string // Options: 4g, 5g. Default: 4g
    cpuPin: boolean // Default: false, Requires total_VM_cores < physical_cores_available (or add more external machines)
    networkEmulation: boolean // Default: false, Connection instances are only relevant if this is set to true
    cloudConnection: Connection
    edgeConnection: Connection
    cloudEdgeConnection: Connection
    cloudEndPointConnection: Connection
    edgeEndPointConnection: Connection

    externalPhysicalMachines: string[]
    netperf: boolean
    basePath: string

    prefixIP: number // Default: 192.168, format: XXX.XXX,
    middleIP: number // Default: 100, Any number 1 - 254
    middleIPBase: number // Default: 90, Any number 1 - 254
    delete: boolean 

    gcpConfig?: GCPConfig // create validator
    benchmarkConfig?: BenchmarkConfig


    constructor(map: ConfigurationMap) {

        this.provider = map.provider;
        this.nodes = map.nodes;
        this.cores = map.cores;
        this.memory = map.memory;
        this.quota = map.quota;

        this.readWriteSpeed = map.readWriteSpeed != null
            ? {
                readSpeed: map.readWriteSpeed.readSpeed != null
                    ? map.readWriteSpeed.readSpeed
                    : { cloud: 0, edge: 0, endpoint: 0 },
                writeSpeed: map.readWriteSpeed.writeSpeed != null
                    ? map.readWriteSpeed.writeSpeed
                    : { cloud: 0, edge: 0, endpoint: 0 },
            }
            : {
                readSpeed: { cloud: 0, edge: 0, endpoint: 0 },
                writeSpeed: { cloud: 0, edge: 0, endpoint: 0 }
            }

        //if null evaluate to false
        this.infra_only = map.infra_only === true
        this.cpuPin = map.cpuPin === true
        this.networkEmulation = map.networkEmulation === true

        this.wirelessNetworkPreset = map.wirelessNetworkPreset != null
            ? map.wirelessNetworkPreset
            : '4g'


        this.cloudConnection = map.cloudConnection != null
            ? {
                latencyAvg: map.cloudConnection.latencyAvg != null
                    ? map.cloudConnection.latencyAvg
                    : 0,
                latencyVar: map.cloudConnection.latencyVar != null
                    ? map.cloudConnection.latencyVar
                    : 0,
                throughput: map.cloudConnection.throughput != null
                    ? map.cloudConnection.throughput
                    : 1000
            }
            : { latencyAvg: 0, latencyVar: 0, throughput: 1000 }

        this.edgeConnection = map.edgeConnection != null
            ? {
                latencyAvg: map.edgeConnection.latencyAvg != null
                    ? map.edgeConnection.latencyAvg
                    : 7.5,
                latencyVar: map.edgeConnection.latencyVar != null
                    ? map.edgeConnection.latencyVar
                    : 2.5,
                throughput: map.edgeConnection.throughput != null
                    ? map.edgeConnection.throughput
                    : 1000
            }
            : { latencyAvg: 7.5, latencyVar: 2.5, throughput: 1000 }

        this.cloudEdgeConnection = map.cloudEdgeConnection != null
            ? {
                latencyAvg: map.cloudEdgeConnection.latencyAvg != null
                    ? map.cloudEdgeConnection.latencyAvg
                    : 7.5,
                latencyVar: map.cloudEdgeConnection.latencyVar != null
                    ? map.cloudEdgeConnection.latencyVar
                    : 2.5,
                throughput: map.cloudEdgeConnection.throughput != null
                    ? map.cloudEdgeConnection.throughput
                    : 1000
            }
            : { latencyAvg: 7.5, latencyVar: 2.5, throughput: 1000 }

        this.cloudEndPointConnection = map.cloudEndPointConnection != null
            ? {
                latencyAvg: map.cloudEndPointConnection.latencyAvg != null
                    ? map.cloudEndPointConnection.latencyAvg
                    : 45,
                latencyVar: map.cloudEndPointConnection.latencyVar != null
                    ? map.cloudEndPointConnection.latencyVar
                    : 5,
                throughput: map.cloudEndPointConnection.throughput != null
                    ? map.cloudEndPointConnection.throughput
                    : 7.21
            }
            : { latencyAvg: 45, latencyVar: 5, throughput: 7.21 }

        this.edgeEndPointConnection = map.EdgeEndPointConnection != null
            ? {
                latencyAvg: map.EdgeEndPointConnection.latencyAvg != null
                    ? map.EdgeEndPointConnection.latencyAvg
                    : 7.5,
                latencyVar: map.EdgeEndPointConnection.latencyVar != null
                    ? map.EdgeEndPointConnection.latencyVar
                    : 2.5,
                throughput: map.EdgeEndPointConnection.throughput != null
                    ? map.EdgeEndPointConnection.throughput
                    : 7.21
            }
            : { latencyAvg: 7.5, latencyVar: 2.5, throughput: 7.21 }

        this.externalPhysicalMachines = map.externalPhysicalMachines != null
            ? map.externalPhysicalMachines
            : []

        this.netperf = map.netperf === true
        this.basePath = map.basePath != null
            ? map.basePath
            : "~"

        this.prefixIP = map.prefixIP != null 
            ? map.prefixIP
            : 192.168

        this.middleIP = map.middleIP != null
            ? map.middleIP
            : 100

        this.middleIPBase = map.middleIPBase != null
            ? map.middleIPBase
            : 90

        

        this.delete = map.delete === true

        //TODO ask mathijs if GCP config needs to have default values
        //NOW it does
        this.gcpConfig = map.provider === "gcp"
            ? map.gcpConfig != null
                ? map.gcpConfig
                : defaultGCPConfig()
            : undefined

        this.benchmarkConfig = !map.infra_only
            ? map.benchmarkConfig != null
                ? {
                    resourceManager: map.benchmarkConfig.resourceManager,
                    resourceManagerOnly: map.benchmarkConfig.resourceManagerOnly === true,
                    dockerPull: map.benchmarkConfig.dockerPull === true,
                    application: map.benchmarkConfig.application,

                    applicationWorkerCPU: map.benchmarkConfig.applicationWorkerCPU != null
                        ? map.benchmarkConfig.applicationWorkerCPU
                        : map.cores.cloud - 0.5,

                    applicationWorkerMemory: map.benchmarkConfig.applicationWorkerMemory != null
                        ? map.benchmarkConfig.applicationWorkerMemory
                        : map.cores.cloud - 0.5,

                    applicationEndpointCPU: map.benchmarkConfig.applicationEndpointCPU != null
                        ? map.benchmarkConfig.applicationEndpointCPU
                        : map.cores.endpoint,
                    applicationEndpointMemory: map.benchmarkConfig.applicationEndpointMemory != null
                        ? map.benchmarkConfig.applicationEndpointMemory
                        : map.cores.endpoint,
                    applicationVars: map.benchmarkConfig.applicationVars != null
                        ? map.benchmarkConfig.applicationVars
                        : undefined


                }
                : undefined
            : undefined

    }

    validate() {
        checkValidator(nodesValidator(this.nodes))
        checkValidator(coresValidator(this.nodes, this.cores))
        checkValidator(quotaValidator(this.nodes, this.quota))
        checkValidator(memoryValidator(this.nodes, this.memory))
        checkValidator(readWriteSpeedValidator(this.readWriteSpeed))
        checkValidator(connectionValidator(this.cloudConnection))
        checkValidator(connectionValidator(this.edgeConnection))
        checkValidator(connectionValidator(this.cloudEdgeConnection))
        checkValidator(connectionValidator(this.cloudEndPointConnection))
        checkValidator(connectionValidator(this.edgeEndPointConnection))
        checkValidator(prefixIPValidator(this.prefixIP))
    }
}

// example of a configuration instance
const config1 = new Configuration({
    provider: 'qemu',
    nodes: { cloud: 2, edge: 5, endpoint: 2 },
    cores: { cloud: 2, edge: 2, endpoint: 2 },
    memory: { cloud: 5, edge: 1, endpoint: 8 },
    quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },
    readWriteSpeed: {
        readSpeed: { cloud: 1, edge: 5, endpoint: 2 },
        writeSpeed: { cloud: 3, edge: 5, endpoint: 4 }
    },
    prefixIP: 223.100, // as this is handled as a number trailing zeros are assumed
    infra_only: false,
    cloudConnection: { latencyAvg: 2 },
    benchmarkConfig: {
        resourceManager: "kubernetes",
        application: "asd",
        applicationVars: Object.fromEntries([
            ["frequency", 5]
        ])
    }
})

config1.validate()
console.log(config1)
console.log(JSON.stringify(config1))

