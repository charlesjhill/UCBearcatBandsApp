//
//  Locker.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/1/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct Locker: DjangoModel {
    
    let id: Int
    
    /// The number of the Locker
    let number: Int
    
    /// The combination of the Locker, given as "##-##-##"
    let combination: String
    
    /// Assets contained in the Locker, if any
    let asset: [GenericAsset]
    
}

extension Locker: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, number, combination, asset
    }
    
}
