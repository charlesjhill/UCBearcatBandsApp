//
//  InstrumentCellVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit

class InstrumentCellVC: UIViewController {
    
    let instrument: Instrument
    
    @IBOutlet private var bigLabel: UILabel?
    @IBOutlet private var detailLabel: UILabel?
    
    init(_ i: Instrument) {
        instrument = i
        super.init(nibName: "InstrumentCell", bundle: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        bigLabel?.text = instrument.ucTagNumber
        detailLabel?.text = instrument.kind.rawValue
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
