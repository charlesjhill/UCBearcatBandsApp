//
//  Dictable.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// A protocol specifying that the object can be encoded and decoded, as well as serialized into a dictionary.
protocol Dictable: Codable {
    
    /// Converts the object to a dictionary
    ///
    /// - Returns:
    ///   - An Optional dictionary where each key is a string and the payload is any type of data. It will correspond
    ///     directly to a JSON encoded representation of the object.
    func toDictionary() -> [String: Any]?

}
