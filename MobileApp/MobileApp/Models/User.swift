//
//  User.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct User {
    
    /// The unique database ID of the User
    let id: Int
    
    /// The username of the User; we'll probably ignore this
    let username: String
    
    /// The full name of the User
    let fullName: String
    
    /// The User's email
    let email: String
    
    /// The User's student status (true for students, false for faculty)
    let isStudent: Bool
    
}

extension User: Dictable {
    
    /// User coding keys let us map JSON values to our desired property names (and ignore properties we don't care
    /// about, if any).
    enum CodingKeys: String, CodingKey {
        case id, username, email
        case fullName = "full_name"
        case isStudent = "is_student"
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
