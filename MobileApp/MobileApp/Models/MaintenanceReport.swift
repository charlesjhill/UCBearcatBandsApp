//
//  MaintenanceReport.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/1/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct MaintenanceReport: DjangoModel {
    
    let id: Int
    
    /// The cost of the maintenance performed
    let cost: Decimal
    
    /// A brief description of what maintenance was performed
    let service: String
    
    /// The invoice number of the maintenance request
    let invoiceNumber: String
    
    /// Assets serviced by the maintenance, if any
    let asset: [GenericAsset]
    
}

extension MaintenanceReport: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, cost, service, asset
        case invoiceNumber = "invoice_number"
    }
    
}
