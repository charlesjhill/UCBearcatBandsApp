//
//  Student.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct Student {
    let firstName: String
    let lastName: String
    let mNumber: String
}

extension Student: Dictable {
    /// Student coding keys let us map JSON values to our desired property names (and ignore properties we don't care
    /// about, if any).
    enum CodingKeys: String, CodingKey {
        case firstName = "first_name"
        case lastName = "last_name"
        case mNumber = "m_number"
    }

    public func toDictionary() -> [String: Any]? {
        return (try? JSONSerialization.jsonObject(with: JSONEncoder().encode(self))) as? [String: Any]
    }
}


