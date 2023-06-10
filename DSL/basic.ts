import Configuration from "./configuration"
import { applicationVars } from "./generics"

//TODO: press tab to quickly fill in placeholder values
const newConfiguration = new Configuration(
    {
        infrastructure: {
            provider: 'qemu',
            nodes: { cloud: 2, edge: 0, endpoint: 3 },
            cores: { cloud: 2, edge: 2, endpoint: 2 },
            memory: { cloud: 5, edge: 1, endpoint: 8 },
            quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },

        },
        //if infra only is set to true benchmarkConfig can be removed
        benchmark: {
            resourceManager: "kubecontrol",
            application: "image_classification", // has to correspond to an existing application module
            applicationVars: applicationVars([
                ["sleep_time", 60], //variable in the sleep application
                // key value pair syntax: ["frequency", 5]
            ])
        }
    }

)

newConfiguration.validate()
// newConfiguration.printJson()

//TODO: press tab to quickly fill in placeholder values
const conf = new Configuration({
    infrastructure: {
        provider: 'gcp',
        nodes: { cloud: 1, edge: 2, endpoint: 2 },  // Options: x >= 0
        cores: { cloud: 1, edge: 1, endpoint: 1 }, // Options: cloud >= 2, edge & endpoint >= 1 (each)
        memory: { cloud: 1, edge: 1, endpoint: 1 }, // x >= 1
        quota: { cloud: 1, edge: 1, endpoint: 1 }, // Options: 0.1 <=x <= 1.0
    },
    //if infra only is set to true benchmarkConfig can be removed
    benchmark: {
        resourceManager: "kubeedge",
        application: "image_classification", // has to correspond to an existing application module
        applicationVars: applicationVars([
            ["sleep_time", 60], //variable in the sleep application
            // key value pair syntax: ["frequency", 5]
        ])
    }
})

conf.validate()
conf.printJson()

// //TODO: press tab to quickly fill in placeholder values
// const configList = [
//     new Configuration({
//         infrastructure: {
//             provider: 'qemu',
//             nodes: { cloud: 0, edge: 0, endpoint: 0 },  // Options: x >= 0
//             cores: { cloud: 0, edge: 0, endpoint: 0 }, // Options: cloud >= 2, edge & endpoint >= 1 (each)
//             memory: { cloud: 0, edge: 0, endpoint: 0 }, // x >= 1
//             quota: { cloud: 0, edge: 0, endpoint: 0 }, // Options: 0.1 <=x <= 1.0
//         },
//         benchmark: {
//             resourceManager: "kubernetes",
//             application: "empty", // has to correspond to an existing application module
//             applicationVars: applicationVars([
//                 ["sleep_time", 60], //variable in the sleep application
//                 // key value pair syntax: ["frequency", 5]
//             ])
//         }
//     }),
//     // more configurations can be placed below,
// ]

// configList.forEach((config) => config.validate())


// example of a configuration instance
// const config1 = new Configuration({
//     provider: 'qemu',
//     nodes: { cloud: 2, edge: 5, endpoint: 2 },
//     cores: { cloud: 2, edge: 2, endpoint: 2 },
//     memory: { cloud: 5, edge: 1, endpoint: 8 },
//     quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },
//     readWriteSpeed: {
//         readSpeed: { cloud: 1, edge: 5, endpoint: 2 },
//         writeSpeed: { cloud: 3, edge: 5, endpoint: 4 }
//     },
//     prefixIP: 223.100, // as this is handled as a number trailing zeros are assumed
//     middleIPBase: 244,
//     infra_only: false,
//     cloudConnection: { latencyAvg: 2 },
//     benchmarkConfig: {
//         resourceManager: "kubernetes",
//         application: "asd",
//         applicationVars: applicationVars(
//             [
//                 ["frequency", 5]
//             ]
//         ),
//         applicationsPerWorker: 1,
//         applicationEndpointCPU: 0.2
//     }
// })

// config1.validate()
// config1.printJson()


// //TODO: press tab to quickly fill in placeholder values
// const configList = [

// // example of a configuration instance
// new Configuration({
//     provider: 'qemu',
//     nodes: { cloud: 2, edge: 5, endpoint: 2 },
//     cores: { cloud: 2, edge: 2, endpoint: 2 },
//     memory: { cloud: 5, edge: 1, endpoint: 8 },
//     quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },
//     readWriteSpeed: {
//         readSpeed: { cloud: 1, edge: 5, endpoint: 2 },
//         writeSpeed: { cloud: 3, edge: 5, endpoint: 4 }
//     },
//     prefixIP: 223.100, // as this is handled as a number trailing zeros are assumed
//     middleIPBase: 244,
//     infra_only: false,
//     cloudConnection: { latencyAvg: 2 },
//     benchmarkConfig: {
//         resourceManager: "kubernetes",
//         application: "asd",
//         applicationVars: applicationVars(
//             [
//                 ["frequency", 5]
//             ]
//         ),
//         applicationsPerWorker: 1,
//         applicationEndpointCPU: 0.2
//     }
// }),
// example of a configuration instance
// new Configuration({
//     provider: 'qemu',
//     nodes: { cloud: 2, edge: 5, endpoint: 2 },
//     cores: { cloud: 2, edge: 2, endpoint: 2 },
//     memory: { cloud: 5, edge: 1, endpoint: 8 },
//     quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },
//     readWriteSpeed: {
//         readSpeed: { cloud: 1, edge: 5, endpoint: 2 },
//         writeSpeed: { cloud: 3, edge: 5, endpoint: 4 }
//     },
//     prefixIP: 223.100, // as this is handled as a number trailing zeros are assumed
//     middleIPBase: 244,
//     infra_only: false,
//     cloudConnection: { latencyAvg: 2 },
//     benchmarkConfig: {
//         resourceManager: "kubernetes",
//         application: "asd",
//         applicationVars: applicationVars(
//             [
//                 ["frequency", 5]
//             ]
//         ),
//         applicationsPerWorker: 1,
//         applicationEndpointCPU: 0.2
//     }
// })

// more configurations can be placed below,
// ]

// configList.forEach((config) => config.validate())
// console.log(JSON.stringify(configList))

//TODO: press tab to quickly fill in placeholder values
// const newConfiguration = new Configuration(
//     {
//         infrastructure: {
//             provider: 'qemu',
//             nodes: { cloud: 2, edge: 0, endpoint: 0 },
//             cores: { cloud: 2, edge: 2, endpoint: 2 },
//             memory: { cloud: 5, edge: 1, endpoint: 8 },
//             quota: { cloud: 0.5, edge: 0.8, endpoint: 0.4 },

//             //if infra only is set to true benchmarkConfig can be removed
//             // benchmarkConfig: {
//             //     resourceManager: "kubernetes",
//             //     application: "empty", // has to correspond to an existing application module
//             //     applicationVars: applicationVars([
//             //         ["sleep_time", 60], //variable in the sleep application
//             //         // key value pair syntax: ["frequency", 5]
//             //     ])
//             // }
//         },
//         //if infra only is set to true benchmarkConfig can be removed
//         benchmark: {
//             resourceManager: "kubecontrol",
//             application: "empty", // has to correspond to an existing application module
//             applicationVars: applicationVars([
//                 ["sleep_time", 60], //variable in the sleep application
//                 // key value pair syntax: ["frequency", 5]
//             ])
//         }
//     }

// )

// newConfiguration.validate()
// newConfiguration.printJson()