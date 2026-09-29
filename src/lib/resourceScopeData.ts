export interface ResourceTreeNode {
  id: string;
  name: string;
  type:
    | "State"
    | "District"
    | "City"
    | "Partner"
    | "Fleet"
    | "Vehicle"
    | "Driver"
    | "User"
    | "Ride";
  children?: ResourceTreeNode[];
}

export const MOCK_RESOURCE_HIERARCHY: ResourceTreeNode[] = [
  {
    id: "st_berlin",
    name: "Berlin State",
    type: "State",
    children: [
      {
        id: "dist_mitte",
        name: "Mitte District",
        type: "District",
        children: [
          {
            id: "city_berlin_c",
            name: "Berlin Central",
            type: "City",
            children: [
              {
                id: "ptr_ecomove",
                name: "EcoMove Mobility",
                type: "Partner",
                children: [
                  {
                    id: "flt_ber_express",
                    name: "Berlin Express Fleet",
                    type: "Fleet",
                    children: [
                      {
                        id: "veh_bin_4022",
                        name: "Tesla Model 3 (B-IN 4022)",
                        type: "Vehicle",
                        children: [
                          {
                            id: "drv_hans_gruber",
                            name: "Hans Gruber (Driver)",
                            type: "Driver",
                            children: [
                              {
                                id: "usr_eleanor_vance",
                                name: "Eleanor Vance (User)",
                                type: "User",
                                children: [
                                  {
                                    id: "rd_8801",
                                    name: "Ride #RD-8801 (Mitte -> Brandenburg Gate)",
                                    type: "Ride",
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "st_bavaria",
    name: "Bavaria State",
    type: "State",
    children: [
      {
        id: "dist_schwabing",
        name: "Schwabing District",
        type: "District",
        children: [
          {
            id: "city_munich_c",
            name: "Munich City",
            type: "City",
            children: [
              {
                id: "ptr_transcity",
                name: "TransCity GmbH",
                type: "Partner",
                children: [
                  {
                    id: "flt_mun_alpha",
                    name: "Munich Fleet Alpha",
                    type: "Fleet",
                    children: [
                      {
                        id: "veh_minf_8812",
                        name: "Toyota RAV4 Hybrid (M-INF 8812)",
                        type: "Vehicle",
                        children: [
                          {
                            id: "drv_stefan_meyer",
                            name: "Stefan Meyer (Driver)",
                            type: "Driver",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
