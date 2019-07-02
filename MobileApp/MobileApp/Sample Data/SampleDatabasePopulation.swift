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
    private var auth: MoyaProvider<AuthService> = MoyaProvider<AuthService>()
    
    public func populate() {
        for _ in 1...500 { makeSampleStudent() }
        for _ in 1...500 { makeSampleInstrument() }
        for _ in 1...500 { makeSampleUniform() }
    }
    
    private func makeSampleStudent() {
        
        let email = "sampleEmail\(currentIdx)@gmail.com"
        let pwd = "ucbearcatbands"
        let name = "SampleStudent\(currentIdx)"
        let number = "M12345678"
        auth.request(.registerStudent(email: email, password: pwd, fullName: name, mNumber: number)) { result in }
        currentIdx += 1
        
    }
    
    private func makeSampleInstrument() {
        // TODO: Not implemented
    }
    
    private func makeSampleUniform() {
        // TODO: Not implemented
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
    
}
