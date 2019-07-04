//
//  PurchaseInfo.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/1/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct PurchaseInfo: DjangoModel {
    
    let id: Int
    
    /// The date of the purchase
    let date: Date // TODO: Is Date the right type here?
    
    /// The cost of the purchase
    let cost: Decimal
    
    /// The vendor of the purchase
    let vendor: String
    
    /// The invoice number of the purchase
    let invoiceNumber: String
    
    /// The Asset associated with the purchase, if any
    let asset: GenericAsset?
    
}

extension PurchaseInfo: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, date, cost, vendor, asset
        case invoiceNumber = "invoice_number"
    }
    
}
