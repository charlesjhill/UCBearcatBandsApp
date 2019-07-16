//
//  AuthToken.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/11/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct AuthToken {
    
    let key: String
    
}

extension AuthToken: Codable {
    
    enum CodingKeys: String, CodingKey {
        case key
    }
    
}
