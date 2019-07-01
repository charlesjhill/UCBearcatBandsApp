//
//  Encodable.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

extension Encodable {
    
    /// Converts an Encodable to a dictionary
    ///
    /// - Returns:
    ///   -  An Optional dictionary where each key is a string and the payload is any type of data. It will correspond
    ///      directly to a JSON encoded representation of the object.
    public func toDictionary() -> [String: Any]? {
        return (try? JSONSerialization.jsonObject(with: JSONEncoder().encode(self))) as? [String: Any]
    }
    
}
