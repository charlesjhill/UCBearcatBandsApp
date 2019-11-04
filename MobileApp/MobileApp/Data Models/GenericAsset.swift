//
//  GenericAsset.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/1/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// A concrete implementation of an Asset, for use as a general type where a more specific Asset type is not appropriate
struct GenericAsset: Asset {
    
    let id: Int
    
    let name: String
    
    let condition: AssetCondition
    
    let resourceType: String
    
}

extension GenericAsset: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, name, condition
        case resourceType = "resourcetype"
    }
    
}
