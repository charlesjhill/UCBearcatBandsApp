//
//  EnsembleCellVC.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/26/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class EnsembleCellVC: UIViewController {
    
    let ensemble: Ensemble
    
    @IBOutlet private var bigLabel: UILabel?
    @IBOutlet private var detailLabel: UILabel?
    
    init(_ e: Ensemble) {
        ensemble = e
        super.init(nibName: "EnsembleCell", bundle: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        bigLabel?.text = ensemble.name
        detailLabel?.text = ensemble.term
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public func changeColors(backgroundColor: UIColor = .white, fontColor: UIColor = .black) {
        view.backgroundColor = backgroundColor
        bigLabel?.textColor = fontColor
        detailLabel?.textColor = fontColor
    }
    
}
