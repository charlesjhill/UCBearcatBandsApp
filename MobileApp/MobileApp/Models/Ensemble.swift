//
//  Ensemble.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct Ensemble: DjangoModel {
    let id: Int
    
    let fullName: String
    
    let term: String
    
    let isActive: Bool
    
    let asset: GenericAsset?
}

extension Ensemble: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, term, asset
        case fullName = "full_name"
        case isActive = "is_active"
    }
}
