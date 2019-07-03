//
//  Instrument.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// An enumeration of kinds of Instruments owned by the UC Bearcat Bands
enum InstrumentKind: String, Codable, CaseIterable {
    
    case altoClarinet
    case altoSaxophone
    case bariSaxophone
    case baritone
    case bassClarinet
    case bassTrombone
    case bassoon
    case clarinet
    case cornet
    case eFlatClarinet
    case electricPiano
    case electricViolin
    case euphonium
    case flute
    case frenchHorn
    case marchingHorn // apparently different enough from mellophone
    case mellophone
    case oboe
    case piano
    case piccolo
    case sopranoSaxophone
    case sousaphone
    case tenorSaxophone
    case trombone
    case trumpet
    case tuba
    
}

/// An Instrument owned by the UC Bearcat Bands
struct Instrument: Asset {
    
    let id: Int
    
    let currentOwners: [Student]
    
    let previousOwners: [Student]
    
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
        case id, kind, make, model, condition
        case currentOwners = "current_owners"
        case previousOwners = "previous_owners"
        case serialNumber = "serial_number"
        case ucTagNumber = "uc_tag_number"
        case ucAssetNumber = "uc_asset_number"
    }
    
}
