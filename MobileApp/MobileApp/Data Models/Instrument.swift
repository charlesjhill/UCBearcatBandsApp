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
    
    case altoClarinet = "Alto Clarinet"
    case altoSaxophone = "Alto Saxophone"
    case bariSaxophone = "Baritone Saxophone"
    case baritone = "Baritone"
    case bassClarinet = "Bass Clarinet"
    case bassTrombone = "Bass Trombone"
    case bassoon = "Bassoon"
    case clarinet = "Clarinet"
    case cornet = "Cornet"
    case eFlatClarinet = "Eb Clarinet"
    case electricPiano = "Electric Piano"
    case electricViolin = "Electric Violin"
    case euphonium = "Euphonium"
    case flute = "Flute"
    case frenchHorn = "French Horn"
    case marchingHorn = "Marching Horn"
    case mellophone = "Mellophone"
    case oboe = "Oboe"
    case piano = "Piano"
    case piccolo = "Piccolo"
    case sopranoSaxophone = "Soprano Saxophone"
    case sousaphone = "Sousaphone"
    case tenorSaxophone = "Tenor Saxophone"
    case trombone = "Trombone"
    case trumpet = "Trumpet"
    case tuba = "Tuba"
    
}

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
