//
//  MoyaResponse.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/12/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya

extension Moya.Response {
    
    /// Parse a JSON response into its Codable type
    ///
    /// - Parameters:
    ///   - response: The Moya.Response object provided from a request
    ///
    /// - Returns:
    ///   - A Codable deserialized from JSON data if possible; nil otherwise
    func parseJsonResponse<T: Codable>(response: Moya.Response) -> T? {
        let data = response.data
        var maybeUser: T? = nil
        do {
            maybeUser = try JSONDecoder().decode(T.self, from: data)
        } catch {
            print(response.statusCode)
            print("JSON erorr: \(error)")
        }
        return maybeUser
    }
    
}
