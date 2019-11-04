//
//  User.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// A model for a User of the API
struct User: DjangoModel {
    
    let id: Int
    
    /// The full name of the User
    let fullName: String
    
    /// The User's email
    let email: String
    
    /// The User's student status (true for students, false for faculty)
    let isStudent: Bool
    
    /// The User's staff status (false for students, true for faculty)
    let isStaff: Bool
    
}

extension User: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, email
        case fullName = "full_name"
        case isStudent = "is_student"
        case isStaff = "is_staff"
    }
    
}
