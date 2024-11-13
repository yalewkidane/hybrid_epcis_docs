.. _epcis_hash:

EPCIS Event Hash Generator
==========================

This page describes the `epcis_hash` functionality.

.. contents:: Table of Contents
   :depth: 2
   :local:

Overview
--------

`epcis_event_hash_generator` is a module to generate a hash for EPCIS events based on the GS1 CBV standard. 
You can simply run it using Docker Compose and use the REST API to generate the hash of an event. 
The hash of the event can then be used as the `eventID` to create an EPCIS event, allowing users to check for 
the event's integrity later. 

Below, there are usage instructions on how to install it using Docker and how to make requests using the REST API.

How to Install and Run
----------------------

1. **Create a Directory for Hash_Generator**:
   First, create a directory for the Hash Generator.

   .. code-block:: sh

      mkdir Hash_Generator
      cd Hash_Generator

2. **Create `docker-compose.yml`**:
   Inside the directory, create a `docker-compose.yml` file and add the following content:

   .. code-block:: yaml

      version: '3.3'

      services:
        epcis-hash-generator:
          image: yaledoc/epcis_event_hash_generator:0.1
          ports:
            - "${SERVER_PORT}:${SERVER_PORT}"
          environment:
            - NODE_ENV=production
            - SERVER_PORT=${SERVER_PORT}
            - DEFAULT_HASH_ALGORITHM=${DEFAULT_HASH_ALGORITHM}

3. **Create `.env` File**:
   Create a `.env` file in the same directory and save the following content:

   .. code-block:: ini

      SERVER_PORT=7085
      DEFAULT_HASH_ALGORITHM=sha256 # Options: sha256, sha3-256, sha384, sha512

4. **Run Docker Compose**:
   Use Docker Compose to start the service.

   .. code-block:: sh

      docker-compose up -d

Usage
------

To generate a hash for an EPCIS event, use the following endpoint.

**Endpoint**:  
    `http://{{Server-IP}}:{{SERVER_PORT}}/epcis/hash/events`

**Method**: 
    **POST** 

**Headers**: 
    - `hashAlg`: `sha256`
    - `Content-Type`: `application/json`

Request Body:

.. code-block:: json

   {
       "@context": "https://gs1.github.io/EPCIS/epcis-context.jsonld",
       "eventID": "ni:///sha-256;df7bb3c352fef055578554f09f5e2aa41782150ced7bd0b8af24dd3ccb30ba69?ver=CBV2.0",
       "type": "ObjectEvent",
       "action": "OBSERVE",
       "bizStep": "shipping",
       "disposition": "in_transit",
       "epcList": ["urn:epc:id:sgtin:0614141.107346.2017","urn:epc:id:sgtin:0614141.107346.2018"],
       "eventTime": "2023-06-08T14:58:56.591Z",
       "eventTimeZoneOffset": "-06:00",
       "readPoint": {"id": "urn:epc:id:sgln:0614142.56346.1234", "http://example//readPoint//value":"readpointValue"},
       "bizTransactionList": [  {"type": "po", "bizTransaction": "http://transaction.acme.com/po/12345678" }],
       "ext:test":4
   }


Response Body:

.. code-block:: http

   HTTP/1.1 200 OK
   X-Powered-By: Express
   Content-Type: application/json; charset=utf-8
   Content-Length: 93
   ETag: W/"5d-And/pjoNBcRwUb4q32RmvqUYvNs"
   Date: Wed, 13 Nov 2024 05:50:42 GMT
   Connection: close

   [
     "ni:///sha-256;dd1378e85f309e4a51fadaad03a8b9f71248c4dc9800d347cdefc94d04ae1f5f?ver=CBV2.0"
   ]


More Examples
-------------

Here are some examples of using the `epcis_event_hash_generator`:

.. code-block:: json

   {
     "type": "EPCISDocument",
     "schemaVersion": "2.0",
     "creationDate": "2013-06-04T14:59:02.099+02:00",
     "sender": "urn:epc:id:sgln:0353579.00001.0",
     "receiver": "urn:epc:id:sgln:5012345.00001.0",
     "instanceIdentifier": "1234567890",
     "epcisBody": {
       "eventList": [
         {
           "eventID": "ni:///sha-256;87b5f18a69993f0052046d4687dfacdf48f7c988cfabda2819688c86b4066a49?ver=CBV2.0",
           "type": "AggregationEvent",
           "eventTime": "2013-06-08T14:58:56.591Z",
           "eventTimeZoneOffset": "+02:00",
           "parentID": "urn:epc:id:sscc:0614141.1234567890",
           "childEPCs": ["urn:epc:id:sgtin:0614141.107346.2017", "urn:epc:id:sgtin:0614141.107346.2018"],
           "action": "OBSERVE",
           "bizStep": "receiving",
           "disposition": "in_progress",
           "readPoint": {"id": "urn:epc:id:sgln:0614141.00777.0"},
           "bizLocation": {"id": "urn:epc:id:sgln:0614141.00888.0"},
           "childQuantityList": [
             {"epcClass": "urn:epc:idpat:sgtin:4012345.098765.*", "quantity": 10},
             {"epcClass": "urn:epc:class:lgtin:4012345.012345.998877", "quantity": 200.5, "uom": "KGM"}
           ]
         },
         {
           "eventID": "ni:///sha-256;df7bb3c352fef055...f24dd3ccb30ba69?ver=CBV2.0",
           "type": "ObjectEvent",
           "action": "ADD",
           "bizStep": "shipping",
           "disposition": "in_transit",
           "epcList": ["urn:epc:id:sgtin:0614141.107346.2017", "urn:epc:id:sgtin:0614141.107346.2018"],
           "eventTime": "2022-04-03T20:33:31.116000-06:00",
           "recordTime": "2022-04-03T20:33:31.116000-06:00",
           "eventTimeZoneOffset": "-06:00",
           "readPoint": {"id": "urn:epc:id:sgln:0614141.07346.1234"},
           "bizTransactionList": [
             {"type": "po", "bizTransaction": "http://transaction.acme.com/po/12345678"}
           ]
         }
       ]
     },
     "@context": [
       "https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld",
       {
         "ext3": "http://example.com/ext3/", "ext2": "http://example.com/ext2/", "ext1": "http://example.com/ext1/"
       },
       {
         "ext1:string": {"@type": "xsd:string"},
         "ext1:int": {"@type": "xsd:int"},
         "ext1:boolean": {"@type": "xsd:boolean"},
         "ext1:float": {"@type": "xsd:double"},
         "ext1:time": {"@type": "xsd:dateTimeStamp"},
         "ext3:string": {"@type": "xsd:string"},
         "ext2:int": {"@type": "xsd:int"},
         "ext1:boolean": {"@type": "xsd:boolean"}
       }
     ]
   }
    

.. code-block:: json

    {
    "type": "EPCISDocument",
    "schemaVersion": "2.0",
    "creationDate": "2013-06-04T14:59:02.099+02:00",
    "sender": "urn:epc:id:sgln:0353579.00001.0",
    "receiver": "urn:epc:id:sgln:5012345.00001.0",
    "instanceIdentifier": "1234567890",
    "epcisBody": {
        "eventList": [
        {
            "type": "ObjectEvent",
            "eventTime": "2005-04-05T02:33:31.116Z",
            "eventTimeZoneOffset": "-06:00",
            "eventID": "urn:uuid:374d95fc-9457-4a51-bd6a-0bba133845a8",
            "certificationInfo": "https://accreditation-council.example.org/certificate/ABC12345",
            "epcList": [
            "urn:epc:id:sgtin:0614141.107346.2018"
            ],
            "action": "ADD",
            "bizStep": "receiving",
            "disposition": "in_progress",
            "readPoint": {
            "id": "urn:epc:id:sgln:0012345.22222.400"
            },
            "bizLocation": {
            "id": "urn:epc:id:sgln:0012345.11111.0"
            },
            "bizTransactionList": [
            {
                "type": "po",
                "bizTransaction": "urn:epc:id:gdti:0614141.00001.1618034"
            },
            {
                "type": "pedigree",
                "bizTransaction": "urn:epc:id:gsrn:0614141.0000010253"
            }
            ],
            "quantityList": [
            {
                "epcClass": "urn:epc:class:lgtin:4012345.012345.998877",
                "quantity": 200,
                "uom": "KGM"
            }
            ],
            "sourceList": [
            {
                "type": "location",
                "source": "urn:epc:id:sgln:4012345.00225.0"
            },
            {
                "type": "possessing_party",
                "source": "urn:epc:id:pgln:4012345.00225"
            },
            {
                "type": "owning_party",
                "source": "urn:epc:id:pgln:4012345.00225"
            }
            ],
            "destinationList": [
            {
                "type": "location",
                "destination": "urn:epc:id:sgln:0614141.00777.0"
            },
            {
                "type": "possessing_party",
                "destination": "urn:epc:id:pgln:0614141.00777"
            },
            {
                "type": "owning_party",
                "destination": "urn:epc:id:pgln:0614141.00777"
            }
            ],
            "sensorElementList": [
            {
                "sensorMetadata": {
                "time": "2019-04-02T13:05:00.000Z",
                "deviceID": "urn:epc:id:giai:4000001.111",
                "deviceMetadata": "https://id.gs1.org/8004/4000001111",
                "rawData": "https://example.org/8004/401234599999",
                "startTime": "2019-04-02T12:55:01.000Z",
                "endTime": "2019-04-02T13:55:00.000Z",
                "dataProcessingMethod": "https://example.com/253/4012345000054987",
                "bizRules": "https://example.com/253/4012345000054987",
                "ext1:someFurtherMetadata": "someText"
                },
                "sensorReport": [
                {
                    "type": "Temperature",
                    "deviceID": "urn:epc:id:giai:4000001.111",
                    "rawData": "https://example.org/8004/401234599999",
                    "dataProcessingMethod": "https://example.com/253/4012345000054987",
                    "time": "2019-07-19T13:00:00.000Z",
                    "microorganism": "https://www.ncbi.nlm.nih.gov/taxonomy/1126011",
                    "chemicalSubstance": "https://identifiers.org/inchikey:CZMRCDWAGMRECN-UGDNZRGBSA-N",
                    "value": 26,
                    "component": "example:x",
                    "stringValue": "SomeString",
                    "booleanValue": true,
                    "hexBinaryValue": "f0f0f0",
                    "uriValue": "https://id.gs1.org/8004/4000001111",
                    "minValue": 26,
                    "maxValue": 26.2,
                    "meanValue": 13.2,
                    "percRank": 50,
                    "percValue": 12.7,
                    "uom": "CEL",
                    "sDev": 0.1,
                    "ext1:someFurtherReportData": "someText",
                    "deviceMetadata": "https://id.gs1.org/8004/4000001111"
                }
                ],
                "ext1:float": "20",
                "ext1:time": "2013-06-08T14:58:56.591Z",
                "ext1:array": [
                "12",
                "22",
                "2013-06-08T14:58:56.591Z",
                "true",
                "stringInArray",
                {
                    "ext1:object": {
                    "ext1:object": {
                        "ext2:array": [
                        "14",
                        "23.0",
                        "stringInArrayInObjectInArray"
                        ],
                        "ext2:object": {
                        "ext2:object": {
                            "ext3:string": "stringInObjectInObjectInArray"
                        }
                        },
                        "ext2:int": "13",
                        "ext2:string": "stringInObjectInArray"
                    }
                    }
                }
                ],
                "ext1:boolean": "true",
                "ext1:object": {
                "ext2:array": [
                    "11",
                    "21",
                    "stringInArrayInObject"
                ],
                "ext2:object": {
                    "ext2:object": {
                    "ext3:string": "stringInObjectInObject"
                    }
                },
                "ext2:string": "stringInObject"
                },
                "ext1:default": "stringAsDefaultValue",
                "ext1:int": "10",
                "ext1:string": "string"
            }
            ],
            "persistentDisposition": {
            "set": [
                "completeness_verified"
            ],
            "unset": [
                "completeness_inferred"
            ]
            },
            "ilmd": {
            "ext1:float": "20",
            "ext1:array": [
                "12",
                "22",
                "2013-06-08T14:58:56.591Z",
                "true",
                "stringInArray",
                {
                "ext1:object": {
                    "ext1:object": {
                    "ext2:array": [
                        "14",
                        "23.0",
                        "stringInArrayInObjectInArray"
                    ],
                    "ext2:object": {
                        "ext2:object": {
                        "ext3:string": "stringInObjectInObjectInArray"
                        }
                    },
                    "ext2:int": "13",
                    "ext2:string": "stringInObjectInArray"
                    }
                }
                }
            ],
            "ext1:object": {
                "ext2:array": [
                "11",
                "21",
                "stringInArrayInObject"
                ],
                "ext2:object": {
                "ext2:object": {
                    "ext3:string": "stringInObjectInObject"
                }
                },
                "ext2:string": "stringInObject"
            },
            "cbvmda:countryOfExport": "KR",
            "cbvmda:grossWeight": "3.5",
            "ext1:int": "10",
            "cbvmda:netWeight": "3.5",
            "ext1:time": "2013-06-08T14:58:56.591Z",
            "ext1:boolean": "true",
            "ext1:default": "stringAsDefaultValue",
            "ext1:string": "string",
            "cbvmda:countryOfOrigin": "GB",
            "cbvmda:drainedWeight": "3.5",
            "cbvmda:lotNumber": "ABC123"
            },
            "ext1:float": "20",
            "ext1:time": "2013-06-08T14:58:56.591Z",
            "ext1:array": [
            "12",
            "22",
            "2013-06-08T14:58:56.591Z",
            "true",
            "stringInArray",
            {
                "ext1:object": {
                "ext1:object": {
                    "ext2:array": [
                    "14",
                    "23.0",
                    "stringInArrayInObjectInArray"
                    ],
                    "ext2:object": {
                    "ext2:object": {
                        "ext3:string": "stringInObjectInObjectInArray"
                    }
                    },
                    "ext2:int": "13",
                    "ext2:string": "stringInObjectInArray"
                }
                }
            }
            ],
            "ext1:boolean": "true",
            "ext1:object": {
            "ext2:array": [
                "11",
                "21",
                "stringInArrayInObject"
            ],
            "ext2:object": {
                "ext2:object": {
                "ext3:string": "stringInObjectInObject"
                }
            },
            "ext2:string": "stringInObject"
            },
            "ext1:default": "stringAsDefaultValue",
            "ext1:int": "10",
            "ext1:string": "string"
        }
        ]
    },
    "@context": [
            "https://ref.gs1.org/standards/epcis/2.0.0/epcis-context.jsonld",
            {
            "ext3": "http://example.com/ext3/", "ext2": "http://example.com/ext2/", "ext1": "http://example.com/ext1/"
            },
            {
            "ext1:string": { "@type" : "xsd:string"}, "ext1:int" : {"@type":"xsd:int"}, "ext1:boolean" : {"@type" : "xsd:boolean"},
            "ext1:float" : {"@type" : "xsd:double"}, "ext1:time" : {"@type" : "xsd:dateTimeStamp"}, "ext3:string" : { "@type" : "xsd:string"},
            "ext2:int" : {"@type" : "xsd:int"}, "ext1:boolean" : {"@type" : "xsd:boolean"}
            }
        ]
    }