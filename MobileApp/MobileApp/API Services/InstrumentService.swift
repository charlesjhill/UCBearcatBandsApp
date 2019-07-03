//
//  InstrumentService.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/2/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya

enum InstrumentService {

    
    /// Add an Instrument to the database
    ///
    /// - Parameters:
    ///   - instrument: The Instrument to be added
    case addInstrument(_ instrument: Instrument)
    
    /// Requests and shows all available Instruments
    case showInstruments
    
    /// Requests and shows the Instrument with the given ID
    ///
    /// - Parameters:
    ///   - id: The ID number of the Instrument
    case showInstrument(id: Int)
    
    // TODO: Search for instruments?? I don't know that this would work in the backend
    
    /// Updates an Instrument that currently exists in the database.
    ///
    /// - Parameters:
    ///   - id: The ID number of the Instrument to be updated
    ///   - instrument: The new Instrument information
    case updateInstrument(id: Int, instrument: Instrument)
    
    /// Delete the Instrument with the given ID
    ///
    /// - Parameters:
    ///   - id: The ID number of the Instrument to be deleted
    case deleteInstrument(id: Int)
    
}

extension InstrumentService: TargetType {

    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/instruments/")! }

    var path: String {
        switch self {
        case .showInstrument(let id), .updateInstrument(let id, _), .deleteInstrument(let id):
            return "\(id)/"
        default:
            return ""
        }
    }

    var method: Moya.Method {
        switch self {
        case .showInstrument, .showInstruments:
            return .get
        case .addInstrument:
            return .post
        case .updateInstrument:
            return .put
        case .deleteInstrument:
            return .delete
        }
    }

    var task: Task {
        switch self {
        case .showInstrument, .showInstruments, .deleteInstrument:
            return .requestPlain
        case .addInstrument(let instrument), .updateInstrument(_, let instrument):
            return .requestParameters(parameters: instrument.toDictionary()!, encoding: JSONEncoding.default)
        }
    }

    var sampleData: Data {
        // TODO: Make sample data
        return Data()
    }

    var headers: [String : String]? {
        return ["Content-type": "application/json"]
    }

}
