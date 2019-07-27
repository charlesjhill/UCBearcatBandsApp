//
//  StudentDashboardVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class StudentDashboardVC: UIViewController {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var idLabel: UILabel!
    
    let service = MoyaProvider<StudentService>()
    
    var authenticatedUser: User? = nil {
        didSet {
            guard let user = authenticatedUser else { return }
            service.request(.showStudent(id: user.id)) { result in
                switch result {
                case let .success(moyaResponse):
                    self.student = moyaResponse.parseJsonResponse(response: moyaResponse)
                case let .failure(error):
                    print(error)
                }
            }
        }
    }
    
    var student: Student? = nil {
        didSet {
            updateInfo()
        }
    }
    
    @IBAction func LogoutPressed(_ sender: Any) {
        // For now, because I'm tired of making storyboard segues, this is easy enough
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
        self.present(vc, animated: false, completion: nil)
    }
    
    private func updateInfo() {
        guard let s = student else { return }
        nameLabel?.text = s.user.fullName
        emailLabel?.text = s.user.email
        idLabel?.text = s.mNumber
    }
    
}

