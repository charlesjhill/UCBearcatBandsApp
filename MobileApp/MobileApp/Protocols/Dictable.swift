//
//  Dictable.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

protocol Dictable: Codable {
    func toDictionary() -> [String: Any]?
}
