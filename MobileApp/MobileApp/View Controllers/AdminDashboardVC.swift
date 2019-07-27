//
//  AdminDashboardVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/16/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class AdminDashboardVC: UIViewController {
    
    override func viewDidLoad() {
//        let db = SampleDatabasePopulation()
//        db.populate()
    }

    @IBAction func LogoutPressed(_ sender: Any) {
        // For now, because I'm tired of making storyboard segues, this is easy enough
        let vc = self.storyboard?.instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
        self.present(vc, animated: false, completion: nil)
    }
    
}
