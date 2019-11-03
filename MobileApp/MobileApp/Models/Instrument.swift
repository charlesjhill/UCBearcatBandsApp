//
//  Instrument.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// An Instrument owned by the UC Bearcat Bands
struct Instrument: Asset {
    
    let id: Int
    
    let name: String
    
    let condition: AssetCondition
    
    /// The kind of Instrument
    let kind: InstrumentKind
    
    /// The make (manufacturer) of the Instrument
    let make: String
    
    /// The model of the Instrument
    let model: String
    
    /// The manufacturer-provided serial number of the Instrument
    let serialNumber: String
    
    /// The UC-provided tag number of the Instrument
    let ucTagNumber: String
    
    /// The UC-provided asset number of the Instrument
    let ucAssetNumber: String
    
}

extension Instrument: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, name, kind, make, model, condition
        case serialNumber = "serial_number"
        case ucTagNumber = "uc_tag_number"
        case ucAssetNumber = "uc_asset_number"
    }
    
}
