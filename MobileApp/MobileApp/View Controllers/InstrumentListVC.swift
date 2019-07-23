//
//  InstrumentListVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class InstrumentListVC: UIViewController {
    
    let provider = MoyaProvider<InstrumentService>()
    
    override func viewDidAppear(_ animated: Bool) {
        provider.request(.showInstruments) { result in
            switch result {
            case let .success(moyaResponse):
                let result: [Instrument]? = moyaResponse.parseJsonResponse(response: moyaResponse)
                guard let instruments = result else { return }
                for i in instruments { print(i) }
            case let .failure(error):
                print(error)
            }
        }
    }
    
}
