//
//  LoginVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/11/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class LoginVC: UIViewController {
    
    @IBOutlet weak var EmailField: UITextField!
    @IBOutlet weak var PasswordField: UITextField!
    @IBOutlet weak var LoginButton: UIButton!
    
    let provider = MoyaProvider<AuthService>()
    var token: AuthToken? = nil {
        didSet {
            guard token != nil else { return }
            provider.request(.getUserDetails(tokenKey: self.token!.key), completion: self.userDetailsHandler)
        }
    }
    var user: User? = nil {
        didSet {
            guard user != nil else { return }
            print(user!)
            if user!.isStaff {
                performSegue(withIdentifier: "toAdminPortal", sender: user)
            } else if user!.isStudent {
                performSegue(withIdentifier: "toStudentPortal", sender: user)
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier {
        case "toAdminPortal":
            break
        case "toStudentPortal":
            let vc = segue.destination as! StudentDashboardVC
            vc.authenticatedUser = user
        default:
            break
        }
    }
    
    @IBAction func LoginPressed(_ sender: Any) {
        provider.request(.login(email: EmailField.text!, password: PasswordField.text!)) { result in
            switch result {
            case let .success(moyaResponse):
                self.token = moyaResponse.parseJsonResponse(response: moyaResponse)
            case let .failure(error):
                // TODO: Tell user login failed?
                print(error)
            }
        }
    }
    
    lazy var userDetailsHandler: Completion = { result in
        switch result {
        case let .success(moyaResponse):
            self.user = moyaResponse.parseJsonResponse(response: moyaResponse)
        case let .failure(error):
            // This would be odd; login worked but can't get user details?
            print(error)
        }
    }
    
}
