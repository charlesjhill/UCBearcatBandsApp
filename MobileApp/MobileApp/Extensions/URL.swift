//
//  URL.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/28/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Alamofire

public extension URL {
    
    /// Makes a properly encoded URL given a number of Paramaters for the URL
    ///
    /// - Parameters:
    ///   - baseUrl: The base URL of the to-be-encoded URL (all non-paramater text)
    ///   - terms: A Parameter dictionary specifying each term to be added to the URL as a URLComponent
    static func makeUrlWithTerms(baseUrl: String, terms: Parameters) -> URL? {
        guard let url = URL(string: baseUrl) else { return nil }
        var urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false)
        guard urlComponents != nil else { return nil }
        let queryItems = terms.map{
            return URLQueryItem(name: "\($0)", value: "\($1)")
        }
        urlComponents?.queryItems = queryItems
        
        return urlComponents?.url
    }
    
}
