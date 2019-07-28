//
//  SampleDatabasePopulation.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/2/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya

class SampleDatabasePopulation {
    
    private var currentIdx: Int = 1
    private var sAuth: MoyaProvider<AuthService> = MoyaProvider<AuthService>()
    private var sInstrument: MoyaProvider<InstrumentService> = MoyaProvider<InstrumentService>()
    private var sUniform: MoyaProvider<UniformService> = MoyaProvider<UniformService>()
    private var sEnsemble: MoyaProvider<EnsembleService> = MoyaProvider<EnsembleService>()
    
    public func populate(_ n: Int = 200) {
        for _ in 1...n { makeSampleStudent() }
        for _ in 1...n { makeSampleInstrument() }
        for _ in 1...n { makeSampleUniform() }
        for _ in 1...n { makeSampleEnsemble() }
    }
    
    private func makeSampleStudent() {
        let email = "sampleEmail\(currentIdx)@gmail.com"
        let pwd = "ucbearcatbands"
        let name = "SampleStudent\(currentIdx)"
        let number = "M\(generateRandomDigits(8))"
        sAuth.request(.registerStudent(email: email, password: pwd, fullName: name, mNumber: number), completion: handler)
        currentIdx += 1
    }
    
    private func makeSampleInstrument() {
        let instrument = Instrument(id: 1,
                                    name: "",
                                    condition: AssetCondition.allCases.randomElement()!,
                                    kind: InstrumentKind.allCases.randomElement()!,
                                    make: "Yamaha",
                                    model: "Model",
                                    serialNumber: generateRandomDigits(8),
                                    ucTagNumber: "T\(generateRandomDigits(4))",
                                    ucAssetNumber: generateRandomDigits(8))
        sInstrument.request(.addInstrument(instrument), completion: handler)
    }
    
    private func makeSampleUniform() {
        let uniform = UniformPiece(id: 1,
                                   name: "",
                                   condition: AssetCondition.allCases.randomElement()!,
                                   kind: UniformKind.allCases.randomElement()!,
                                   size: "Size",
                                   number: generateRandomDigits(8))
        sUniform.request(.addUniform(uniform), completion: handler)
    }
    
    private func makeSampleEnsemble() {
        let ensemble = Ensemble(id: 1,
                                name: "Ensemble \(generateRandomDigits(3))",
                                term: "FS19",
                                isActive: true,
                                enrollments: [])
        sEnsemble.request(.addEnsemble(ensemble), completion: handler)
    }
    
    private func generateRandomDigits(_ digitNumber: Int) -> String {
        var number = ""
        for i in 0..<digitNumber {
            var randomNumber = arc4random_uniform(10)
            while randomNumber == 0 && i == 0 {
                randomNumber = arc4random_uniform(10)
            }
            number += "\(randomNumber)"
        }
        return number
    }
    
    private lazy var handler: Completion = { result in
        switch result {
        case let .success(moyaResponse):
            let data = moyaResponse.data
            print(moyaResponse.statusCode)
            print(String(data: data, encoding: .utf8)!)
        case let .failure(error):
            print(error)
        }
        print("")
    }
    
}
