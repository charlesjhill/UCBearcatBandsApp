//
//  UniformPiece.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/1/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// enumeration of uniforms owned by UC Bearcats Bands
enum UniformKind: String, Codable {
    
    case jacket
    case pants
    
}

/// An individual piece of a uniform
struct UniformPiece: Asset {
    
    let id: Int
    
    let currentOwners: [Student]
    
    let previousOwners: [Student]
    
    let condition: AssetCondition
    
    /// The kind of the UniformPiece
    let kind: UniformKind
    
    /// The size of the UniformPiece
    let size: String
    
    /// The number of the UniformPiece (as assigned by the band)
    /// - NOTE: This is, somewhat unexpectedly, a String instead of an Int. The rationale behind this decision,
    /// currently, is due to the fact that some Uniforms (due to age) may have duplicate numbers, so using some format
    /// like "###_old" may help differentiate them. The number is the easiest way to identify the physical uniform, so
    /// we'll want them to be unique if possible.
    let number: String
    
}

extension UniformPiece: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, condition, kind, size, number
        case currentOwners = "current_owners"
        case previousOwners = "previous_owners"
    }
    
}
