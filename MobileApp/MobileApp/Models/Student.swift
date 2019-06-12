//
//  Student.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// The model for a Student user
struct Student {
    
    /// The database-assigned ID of the student
    ///
    /// - Note:
    ///   ID is optional so we may construct students locally; the database will manage assigning IDs so it is nice be
    ///   able to say "make a new student without an ID"
    let id: Int?
    
    /// The first name of the student
    let firstName: String
    
    /// The last name of the student
    let lastName: String
    
    /// The UC identification number - the "M Number" - of the student
    ///
    /// - Note:
    ///   The letter "M" must prepend the remainder of the String, and there must be 8 digits following it.
    let mNumber: String
    
}

extension Student: Dictable {
    
    /// Student coding keys let us map JSON values to our desired property names (and ignore properties we don't care
    /// about, if any).
    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case mNumber = "m_number"
    }

    /// Converts a Student to a dictionary, primarily for use in HTTPS requests
    ///
    /// - Returns:
    ///   -  An Optional dictionary where each key is a string and the payload is any type of data. It will correspond
    ///      directly to a JSON encoded representation of the object.
    public func toDictionary() -> [String: Any]? {
        return (try? JSONSerialization.jsonObject(with: JSONEncoder().encode(self))) as? [String: Any]
    }
    
}


