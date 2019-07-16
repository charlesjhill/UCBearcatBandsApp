//
//  AdminPortalVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/16/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class AdminPortalVC: UIViewController {
    
    override func viewDidLoad() {
        let db = SampleDatabasePopulation()
        db.populate()
    }
    
}
