//
//  ModelProtocols.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

// Note that these are *protocols* instead of structs, because structs do not support inheritance from non-protocol
// types. This is a little undesirable, but since it's unlikely we'll need to work with bare Assets, Models, etc., we
// don't really need to have a concrete value type for them.
//
// We're not using classes because of the benefits of value types over reference types (see
// https://stackoverflow.com/questions/24232799/why-choose-struct-over-class for an interesting discussion on this).
// Ultimately, I've decided to follow the advice "use several structs that conform to a protocol" provided by the user
// "Honey" in their response.

/// A mirror of the relevant properties of the Django "models.Model" class
protocol DjangoModel: Codable {
    
    /// The unique database ID of the object
    var id: Int { get }
    
}

/// An enumeration of the possible conditions of an Asset
enum AssetCondition: String, Codable, CaseIterable {
    
    case new
    case good
    case fair
    case poor
    case bad
    case unusable
    
}

/// A generic Asset of the UC Bearcat Bands
protocol Asset: DjangoModel {
    
    /// The name of the Asset
    var name: String { get }
    
    /// The condition of the Asset
    var condition: AssetCondition { get }
    
}
